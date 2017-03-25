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
    struct sockaddr_in servaddr;
} httpserv;
typedef struct {
    socklen_t len;
    struct sockaddr_in addre;
    int fd;
} httpcli;