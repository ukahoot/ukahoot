#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <netinet/in.h>
#include <netdb.h>
#include <openssl/ssl.h>

struct req {
    SSL* socket;
    struct sockaddr_in addr;
    struct hostent* serv;
    int socket_fd;
};