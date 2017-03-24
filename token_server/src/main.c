#include <stdio.h>
#include <stdlib.h>

#include "request.h"

int main(int argc, char* argv[]) {
	setup_openssl();
	req* r = init_request();
	requst_connect(r);
};