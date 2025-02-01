package validation

import (
	"errors"
	"go-blog-api/entities"
)

func ValidatePost(post entities.Post) error {
	if post.Title == "" {
		return errors.New("title is required")
	}
	if post.Username == "" {
		return errors.New("username is required")
	}
	return nil
}
