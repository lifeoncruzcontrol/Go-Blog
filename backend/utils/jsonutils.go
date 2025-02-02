package utils

import (
	"encoding/json"
	"errors"
	"net/http"
)

func DecodeJSON(r *http.Request, target interface{}) error {
	if r.Body == nil {
		return errors.New("request body is empty")
	}
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(target); err != nil {
		return err
	}
	return nil
}
