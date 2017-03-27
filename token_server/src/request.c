#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>

#include <openssl/ssl.h>
#include "kahoot.h"

typedef struct {
    SSL* conn;
    struct sockaddr_in addr;
    struct hostent* serv;
    int sockfd;
} req;
SSL_CTX* ssl_context;

void setup_openssl(void) {
    SSL_load_error_strings();
    SSL_library_init();
    ssl_context = SSL_CTX_new(SSLv23_client_method());
};
void unload_ctx(void) {
    SSL_CTX_free(ssl_context);
}

req* init_request(void) {
    req* request;
    request = malloc(sizeof(req)); // Allocate a request on the heap
    request->sockfd = socket(AF_INET, SOCK_STREAM, 0);
    request->conn = SSL_new(ssl_context);
    SSL_set_fd(request->conn, request->sockfd);
    request->serv = gethostbyname(KAHOOT_HOST_URI);
    request->addr.sin_family = AF_INET;
   bcopy((char*)request->serv->h_addr,
   (char*)&request->addr.sin_addr.s_addr,
   request->serv->h_length);
    request->addr.sin_port = htons(KAHOOT_SSL_PORT);
    return request;
};
void request_connect(req* request) {
    connect(request->sockfd, 
    (struct sockaddr *) &request->addr,
    sizeof(request->addr));
    SSL_connect(request->conn);
};
int request_write_str(req* request, char* msg) {
    int res = 0;
    res = SSL_write(request->conn, msg, strlen(msg));
    return res;
};
int request_write(req* request, void* msg, int len) {
    int res = 0;
    res = SSL_write(request->conn, msg, len);
    return res;
};
int request_read(req* request, char* buffer, int len) {
    int e = SSL_read(request->conn, buffer, len);
    return e;
};
void request_close(req* request) {
    SSL_shutdown(request->conn);
    close(request->sockfd);
};
void request_free(req* request) {
    SSL_free(request->conn);
    free(request);
};
char* request_kahoot_token(req* request, char* PID) {
    char* headers = get_req_headers(PID);
    char* res = malloc(2048); // Buffer the response will be written to

    request_connect(request);
    int e = request_write_str(request, headers);
    if (e < 0) {
        // Unsuccessful write
        free(headers);
        free(res);
        return NULL;
    }
    char* chunk = malloc(512); // Buffer that holds the response chunks
    e = request_read(request, chunk, 512);
    if (e < 0) {
        // Unsuccessful read
        free(headers);
        free(res);
        free(chunk);
        return NULL;
    }
    strcat(res, chunk); // Initial headers
    e = 256;
    if (strstr(res, "Not Found")) {
        // The request is not chunked and should be shut down
        request_close(request);
        free(res);
        free(headers);
        free(chunk);
        return NULL;
    } else {
        while(e == 256) {
            e = request_read(request, chunk, 256);
            if (e < 0) {
                // Unsuccessful read
                break;
            } else {
                // Successful read
                strncat(res, chunk, e);
            }
        };
        // Free resources
        free(headers);
        free(chunk);
        // Shutdown request
        request_close(request);

        if (e < 0) {
            free(res);
            return NULL;
        } else {
            return res;
        }
    }
};