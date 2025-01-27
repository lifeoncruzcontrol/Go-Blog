package handlers

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"go-blog-api/db"
	"go-blog-api/entities"
	"go-blog-api/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

func GetAllPostsHandler(w http.ResponseWriter) {
	// Create new context
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Create a cursor
	cursor, err := db.Posts.Find(ctx, bson.M{})
	if err != nil {
		log.Printf("Error creating cursor: %v", err)
		http.Error(w, "Error creating cursor", http.StatusInternalServerError)
		return
	}
	defer cursor.Close(ctx)

	// Decode the posts into a pointer pointing to a slice of Posts
	var posts []entities.Post
	if err = cursor.All(ctx, &posts); err != nil {
		log.Printf("Failed to decode posts: %v", err)
		http.Error(w, "Failed to decode posts", http.StatusInternalServerError)
		return
	}

	// Encode posts array and send back to client
	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(posts); err != nil {
		// Log any JSON encoding error
		log.Printf("Error encoding response: %v", err)

		// Return a 500 error if posts encoding fails
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

// func PatchTextByIdHandler(w http.ResponseWriter, r *http.Request) {
// 	urlVars := r.URL.Query()
// 	id := urlVars.Get("id")
// 	if id == "" {
// 		http.Error(w, "ID missing", http.StatusBadRequest)
// 		return
// 	}
// 	post, exist := storage.PostsMap[id]
// 	if !exist {
// 		http.Error(w, "Post does not exist for that ID", http.StatusNotFound)
// 		return
// 	}
// 	var updatedText entities.UpdateText
// 	if err := utils.DecodeJSON(r, &updatedText); err != nil {
// 		http.Error(w, err.Error(), http.StatusInternalServerError)
// 		return
// 	}
// 	post.Text = updatedText.Text
// 	storage.PostsMap[id] = post
// 	w.Header().Set("Content-Type", "application/json")
// 	json.NewEncoder(w).Encode(post)
// }

// func DeletePostByIdHandler(w http.ResponseWriter, r *http.Request) {
// 	urlVars := r.URL.Query()
// 	id := urlVars.Get("id")
// 	if id == "" {
// 		http.Error(w, "ID missing", http.StatusBadRequest)
// 		return
// 	}
// 	_, exist := storage.PostsMap[id]

// 	if !exist {
// 		http.Error(w, "Post does not exist for that ID", http.StatusNotFound)
// 		return
// 	}
// 	delete(storage.PostsMap, id)
// 	w.WriteHeader(http.StatusNoContent)
// }
