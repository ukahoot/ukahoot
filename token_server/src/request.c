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
    char* res = malloc(770); // Buffer the response will be written to
    
    char* chu1 = malloc(512);
    char* chu2 = malloc(256);

    request_connect(request);
    request_write_str(request, headers);
    int e = request_read(request, chu1, 512);
    e = request_read(request, chu2, 256);
    strcat(res, chu1);
    strcat(res, chu2);

    // Free resources
    free(chu1);
    free(chu2);
    free(headers);
    if (e == 0 || e == -1)
        return NULL;
    return res;
};