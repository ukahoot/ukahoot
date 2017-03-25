#include <stdio.h>
#include <stdlib.h>
#include <errno.h>

#include "request.h"
#include "kahoot.h"
#include "httpserv.h"

int main(int argc, char* argv[]) {
	setup_openssl();
	httpserv* h = init_http_server(5556);
};