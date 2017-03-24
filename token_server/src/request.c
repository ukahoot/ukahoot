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

struct req {
    SSL_CTX* context;
    SSL* conn;
    struct sockaddr_in addr;
    struct hostent* serv;
    int sockfd;
};
void init_request(struct req* request) {
    request->sockfd = socket(AF_INET, SOCK_STREAM, 0);
    request->context = SSL_CTX_new(SSLv23_client_method());
    request->conn = SSL_new(request->context);
    SSL_set_fd(request->conn, request->sockfd);
    request->serv = gethostbyname(KAHOOT_HOST_URI);
    request->addr.sin_family = AF_INET;
    request->addr.sin_addr.s_addr = request->serv->h_addr;
};