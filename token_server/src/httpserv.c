#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>

typedef struct {
    pthread_t tid;
    int portno;
    int sockfd;
    struct sockaddr_in addr;
} httpserv;

typedef struct {
    socklen_t len;
    struct sockaddr_in addre;
    int fd;
} httpcli;

httpserv* init_http_server(int port) {
    httpserv* server = malloc(sizeof(httpserv)); // Create HTTP server structure
    server->sockfd = socket(AF_INET, SOCK_STREAM, 0);
    server->addr.sin_family = AF_INET;
    server->addr.sin_addr.s_addr = INADDR_ANY;
    
    server->addr.sin_port = htons(port);
    server->portno = port;
    bind(server->sockfd, (struct sockaddr *) &server->addr, sizeof(server->addr));
    return server;
}