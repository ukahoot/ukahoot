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
    int backl;
    struct sockaddr_in addr;
} httpserv;

typedef struct {
    socklen_t len;
    struct sockaddr_in addr;
    int fd;
    pthread_t tid;
} httpcli;

void* http_handle_client(void* vargp) {
    // TODO: handle client
}

httpserv* http_init_server(int port, int backlog) {
    httpserv* server = malloc(sizeof(httpserv)); // Create HTTP server structure
    server->backl = backlog;
    server->sockfd = socket(AF_INET, SOCK_STREAM, 0);
    server->addr.sin_family = AF_INET;
    server->addr.sin_addr.s_addr = INADDR_ANY;
    
    server->addr.sin_port = htons(port);
    server->portno = port;
    bind(server->sockfd, (struct sockaddr *) &server->addr, sizeof(server->addr));
    return server;
};
void* http_listen_thread(void* vargp) {
    httpserv* h = (httpserv*)vargp; // Cast the argument to an httpserv
    listen(h->sockfd, h->backl);
    httpcli* cli = malloc(sizeof(httpcli)); // TODO: Make SURE this is free'd
    cli->fd = accept(h->sockfd, 
                    (struct sockaddr*) &cli->addr,
                    &cli->len);
    if (cli->fd < 0) {
        // Error accepting the socket
        free(cli);
    } else {
        // Socket accepted successfully
        pthread_create(&cli->tid, NULL, http_handle_client, cli);
        pthread_join(cli->tid, NULL);
    }
};
void http_server_listen(httpserv* server) {
    pthread_create(&server->tid, NULL, http_listen_thread, server);
    pthread_join(server->tid, NULL);
};