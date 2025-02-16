package handlers

import (
	"context"
	"encoding/json"
	"log"
	"math"
	"net/http"
	"time"

	"go-blog-api/db"
	"go-blog-api/entities"
	"go-blog-api/utils"
	"go-blog-api/validation"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

func GetPostsHandler(w http.ResponseWriter, r *http.Request) {
	var req entities.FilterRequest

	if r.Body == nil || r.ContentLength == 0 {
		req = entities.FilterRequest{} // Set an empty request struct
	} else {
		if err := utils.DecodeJSON(r, &req); err != nil {
			log.Printf("Error decoding request body: %v", err)
			http.Error(w, "Invalid JSON", http.StatusBadRequest)
			return
		}
	}

	// Dynamically construct the filter
	var conditions []bson.M

	tags := req.Tags
	if len(tags) > 0 {
		conditions = append(conditions, bson.M{"tags": bson.M{"$in": tags}})
	}

	usernames := req.Usernames
	if len(usernames) > 0 {
		conditions = append(conditions, bson.M{"username": bson.M{"$in": usernames}})
	}

	// Set page limit (default 10)
	limit := req.Limit
	if limit < 1 {
		limit = 10
	}

	// Handle cursor pagination
	if req.NextCursor != "" {
		lastObjectID, err := primitive.ObjectIDFromHex(req.NextCursor)
		if err != nil {
			log.Printf("Error converting ID to valid hex format: %v", err)
			http.Error(w, "Invalid ID format", http.StatusBadRequest)
			return
		}
		conditions = append(conditions, bson.M{"_id": bson.M{"$gt": lastObjectID}})
	}

	var filter bson.M
	if len(conditions) > 0 {
		filter = bson.M{"$and": conditions}
	} else {
		filter = bson.M{}
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	totalDocuments, err := db.Posts.CountDocuments(ctx, filter)
	if err != nil {
		log.Printf("Error counting total number of matching documents: %v", err)
		http.Error(w, "Internal Server Error", http.StatusInternalServerError)
		return
	}

	totalPages := int(math.Ceil(float64(totalDocuments) / float64(limit)))

	opts := options.Find().SetLimit(int64(limit)).SetSort(bson.M{"_id": 1})

	cursor, err := db.Posts.Find(ctx, filter, opts)
	if err != nil {
		log.Printf("Error querying post: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	var results []entities.Post
	if err = cursor.All(ctx, &results); err != nil {
		log.Printf("Error decoding documents into results: %v", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	// If no documents are found, return a 204 No Content status
	if len(results) == 0 {
		w.WriteHeader(http.StatusNoContent)
		return
	}

	// Determine next cursor (last document's _id)
	var nextCursor string
	if len(results) > 0 {
		lastDoc := results[len(results)-1]
		nextCursor = lastDoc.ID.Hex()
	}

	res := entities.Response{
		Data: results,
		Pagination: entities.Pagination{
			Limit:          limit,
			NextCursor:     nextCursor,
			TotalDocuments: totalDocuments,
			TotalPages:     totalPages,
		},
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(res); err != nil {
		// Log any JSON encoding error
		log.Printf("Error encoding response: %v", err)

		// Return a 500 error if response encoding fails
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
}

func GetPostByIDHandler(w http.ResponseWriter, r *http.Request) {
	urlVars := r.URL.Query()
	id := urlVars.Get("id")
	if id == "" {
		http.Error(w, "ID missing", http.StatusBadRequest)
		return
	}

	// Validate if the provided ID is in a valid hex format for MongoDB ObjectID
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		log.Printf("Error converting ID to valid hex format: %v", err)
		http.Error(w, "Invalid ID format", http.StatusBadRequest)
		return
	}

	// Use the valid ObjectID to filter the query
	filter := bson.M{"_id": objectID}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	var res entities.Post
	err = db.Posts.FindOne(ctx, filter).Decode(&res)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			log.Printf("Post not found for id: %s", id)
			http.Error(w, "Post not found", http.StatusNotFound)
		} else {
			log.Printf("Error querying post: %v", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
		}
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(res); err != nil {
		// Log any JSON encoding error
		log.Printf("Error encoding response: %v", err)

		// Return a 500 error if response encoding fails
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
}

func CreatePostHandler(w http.ResponseWriter, r *http.Request) {
	var newPost entities.Post
	if err := utils.DecodeJSON(r, &newPost); err != nil {
		log.Printf("Error decoding JSON: %v", err)
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}
	// Initialize the ID field with a new ObjectID
	newPost.ID = primitive.NewObjectID()
	newPost.Datetime = time.Now()

	// Ensure Tags field is initialized to an empty slice if nil
	if newPost.Tags == nil {
		newPost.Tags = []string{}
	}

	if err := validation.ValidatePost(newPost); err != nil {
		log.Printf("Missing title or username in post: %v", err)
		http.Error(w, "Missing title or username in post", http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	doc, err := db.Posts.InsertOne(ctx, newPost)
	if err != nil {
		log.Printf("Error saving new post to database: %v", err)
		http.Error(w, "Failed to save post", http.StatusInternalServerError)
		return
	}
	// Convert the inserted ID to a string (hex format) for client use
	insertedID, ok := doc.InsertedID.(primitive.ObjectID)
	if !ok {
		log.Printf("Error converting inserted ID to ObjectID")
		http.Error(w, "Error generating post ID", http.StatusInternalServerError)
		return
	}
	res := entities.PostResponse{
		ID:       insertedID.Hex(),
		Datetime: newPost.Datetime,
		Tags:     newPost.Tags,
	}
	w.Header().Set("Content-Type", "application/json")
	// Encode and send the newPost result back to the client
	if err := json.NewEncoder(w).Encode(res); err != nil {
		// Log any JSON encoding error
		log.Printf("Error encoding response: %v", err)

		// Return a 500 error if response encoding fails
		http.Error(w, http.StatusText(http.StatusInternalServerError), http.StatusInternalServerError)
		return
	}
}

func PatchTextByIdHandler(w http.ResponseWriter, r *http.Request) {
	urlVars := r.URL.Query()
	id := urlVars.Get("id")
	if id == "" {
		http.Error(w, "ID missing", http.StatusBadRequest)
		return
	}

	var updatedText entities.UpdateText
	if err := utils.DecodeJSON(r, &updatedText); err != nil {
		http.Error(w, "Error updating post text", http.StatusInternalServerError)
		return
	}

	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		http.Error(w, "Invalid ID format", http.StatusBadRequest)
		return
	}

	filter := bson.D{{Key: "_id", Value: objectID}}
	update := bson.D{{Key: "$set", Value: bson.D{{Key: "text", Value: updatedText.Text}}}}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := db.Posts.UpdateOne(ctx, filter, update)
	if err != nil {
		http.Error(w, "Error updating post text", http.StatusInternalServerError)
		return
	}

	// Check if any document was modified
	if result.ModifiedCount == 0 {
		http.Error(w, "No document found with the given ID", http.StatusNotFound)
		return
	}

	// Send the success response
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Document updated successfully",
		"updated": result.ModifiedCount,
	})
}

func DeletePostByIdHandler(w http.ResponseWriter, r *http.Request) {
	urlVars := r.URL.Query()
	id := urlVars.Get("id")
	if id == "" {
		http.Error(w, "ID missing", http.StatusBadRequest)
		return
	}
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		http.Error(w, "Invalid ID format", http.StatusBadRequest)
		return
	}

	filter := bson.D{{Key: "_id", Value: objectID}}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	result, err := db.Posts.DeleteOne(ctx, filter)
	if err != nil {
		http.Error(w, "Error deleting post for provided ID", http.StatusInternalServerError)
		return
	}

	if result.DeletedCount == 0 {
		http.Error(w, "No document found for given ID", http.StatusNotFound)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]interface{}{
		"message": "Document deleted successfully",
		"updated": result.DeletedCount,
	})
}
