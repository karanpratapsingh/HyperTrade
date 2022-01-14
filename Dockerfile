FROM golang:1.17.2 as development
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
CMD tail -f /dev/null
