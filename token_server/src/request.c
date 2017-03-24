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
    SSL_CTX* context;
    SSL* conn;
    struct sockaddr_in addr;
    struct hostent* serv;
    int sockfd;
} req;

void setup_openssl(void) {
    SSL_load_error_strings();
    SSL_library_init();
};

req* init_request(void) {
    req* request;
    request = malloc(sizeof(req)); // Allocate a request on the heap
    request->sockfd = socket(AF_INET, SOCK_STREAM, 0);
    request->context = SSL_CTX_new(SSLv23_client_method());
    request->conn = SSL_new(request->context);
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
};
int request_write_str(req* request, char* msg) {
    int res = 0;
    res = SSL_write(request->conn, msg, strlen(msg));
    return res;
};