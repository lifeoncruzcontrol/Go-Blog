package db

import (
	"context"
	"log"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var (
	MongoURI string
	Ctx      context.Context
	Cancel   context.CancelFunc
	Client   *mongo.Client
	Posts    *mongo.Collection
)

func init() {
	MongoURI = os.Getenv("MONGO_URI")
	if MongoURI == "" {
		log.Fatal("Missing MONGO_URI variable")
		return
	}

	Ctx, Cancel = context.WithTimeout(context.Background(), 5*time.Second)

	var err error
	Client, err = mongo.Connect(Ctx, options.Client().ApplyURI(MongoURI))
	if err != nil {
		log.Fatal("Error connecting to database")
		Cancel()
		return
	}
	// Initialize the database. Keep this private.
	// APIs should only interact with collections
	db := Client.Database("blog-db")
	// Initialize Posts collection
	Posts = db.Collection("posts")
}
