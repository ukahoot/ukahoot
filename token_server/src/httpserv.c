#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#include <pthread.h>

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

httpserv* http_init_server(int port) {
    httpserv* server = malloc(sizeof(httpserv)); // Create HTTP server structure
    server->sockfd = socket(AF_INET, SOCK_STREAM, 0);
    server->addr.sin_family = AF_INET;
    server->addr.sin_addr.s_addr = INADDR_ANY;
    
    server->addr.sin_port = htons(port);
    server->portno = port;
    bind(server->sockfd, (struct sockaddr *) &server->addr, sizeof(server->addr));
    return server;
};
void* http_listen_thread(void* vargp) {
    printf("HTTP server started.\n");
    // TODO: handle HTTP server creation
};
void http_server_listen(httpserv* server) {
    pthread_create(&server->tid, NULL, http_listen_thread, server);
    pthread_join(server->tid, NULL);
};