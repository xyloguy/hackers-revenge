package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

// HealthCheck handles the /healthy endpoint
func HealthCheck(c *gin.Context) {
	c.JSON(http.StatusOK, gin.H{"status": "ok"})
}

// TeapotHandler handles the root endpoint with a teapot response
func TeapotHandler(c *gin.Context) {
	c.JSON(http.StatusTeapot, gin.H{"error": "I'm a teapot"})
}
