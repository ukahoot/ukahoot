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
    if (headers_len > 1000 || headers_len < 20) {
        printf("String too small\n");
        return NULL;
    } else {
        if (req[0] != 'G' || // Check for GET request
            req[1] != 'E' ||
            req[2] != 'T') {
                return NULL;
            }
        else if (!strcmp(&req[5], "?") ||
            !strcmp(&req[6], "p") ||
            !strcmp(&req[7], "i") ||
            !strcmp(&req[8], "d") ||
            !strcmp(&req[9], "=")) {
                return NULL;
        } else {
            // The request is probably valid, look for the PID
            char* sreq = strstr(req, "pid=");
            if (sreq != NULL) {
                char* pid = malloc(8);
                int i = 4;
                while ((sreq + i)[0] != ' ' && i < 12) {
                    pid[i - 4] = sreq[i];
                    i++;
                }
                int pidlen = strlen(pid);
                if (pidlen > 3 || pidlen < 8) {
                    // PIDs are always 4 to 8 characters
                    pid = realloc(pid, pidlen); // Allign the buffer to it's size
                    return pid;
                } else {
                    free(pid);
                    return NULL;
                }
            } else {
                return NULL;
            }
        }
    }
};
char* get_header_token(char* response) {
    char* t_header = strstr(response, KAHOOT_SESSION_HEADER);
    if (t_header == NULL) {
        return NULL;
    } else {
        t_header = t_header + SESSION_HEADER_LEN;
        char* token = malloc(129); // Return value
        memcpy(token, t_header, 128);
        token[128] = '\0'; // Make sure a null byte is present
        return token;
    }
};
char* get_response_body(char* response) {
    char* res_start = strstr(response, KAHOOT_RES_START);
    if (res_start == NULL) {
        // Substring couldn't be found for some reason
        return NULL;
    } else {
        char* res_body = malloc(MAX_BODY_SIZE);
        int i = 0;
        while ((res_start + i)[0] != '\r' && i < MAX_BODY_SIZE) {
            res_body[i] = res_start[i];
            ++i;
        }
        return res_body;
    }
}