#include <string.h>
#include <stdlib.h>
#include <stdio.h>
#include <string.h>
#include "kahoot.h"

char* get_req_headers(char* token) {
    int token_len = strlen(token);
    int headers_len = KAHOOT_HEADERS_SIZE +
                    KAHOOT_GET_LEN +
                    token_len + 15;
    char* headers = malloc(headers_len);
    bzero(headers, headers_len);
    strcat(headers, KAHOOT_TOKEN_GET);
    strcat(headers, token);
    strcat(headers, "/?1");
    strcat(headers, KAHOOT_TOKEN_HEADERS);
    return headers;
}
char* get_pid_query(char* req) {
    int headers_len = strlen(req);
    // Sanity checks
    if (headers_len > 1000 || headers_len < 40) {
        return NULL;
    } else {
        if (req[0] != 'G' || // Check for GET request
            req[1] != 'E' ||
            req[2] != 'T')
                return NULL;
        else if (req[5] != "?" ||
            req[7] != "p" ||
            req[8] != "i" ||
            req[9] != "d" ||
            req[10] != "=") {
                return NULL;
        } else {
            // The request is probably valid, look for the PID
            char* sres = strstr(res, "pid=");
            if (sres != NULL) {
                int index = 3;
                char* pid = malloc(8);
                while(sres[index] != ' ' || index != 11) {
                    pid[index] = sres[index];
                    index++;
                }
                return pid;
            } else {
                return NULL;
            }
        }
    }
};