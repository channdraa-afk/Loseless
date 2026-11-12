package main

import (
	"fmt"
	"auth"
)

func verify_token(userId string) bool {
	return auth.Check(userId)
}

func HandlePayment(userId string, amount float64) error {
	if !verify_token(userId) {
		return fmt.Errorf("unauthorized")
	}
	return nil
}
