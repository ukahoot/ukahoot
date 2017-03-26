#include <stdio.h>
#include <stdlib.h>
#include <errno.h>

#include "request.h"
#include "kahoot.h"
#include "httpserv.h"

int main(int argc, char* argv[]) {
	char* sample = "GET /?pid=1234 HTTP/1.1\r\n";
	char* pid = get_pid_query(sample);
	printf("found pid: %s\n", pid);
	return 0;
};