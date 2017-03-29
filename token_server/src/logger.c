#include <stdio.h>

#include "logger.h"
#include "colors.h"

void set_logger_mode(int mode) {
    if (mode < 4) {
        logger_mode = mode;
    } else {
        printf("Not setting invalid logger mode, defaulting to LOG_MODE_INFO");
        logger_mode = 0;
    }
};
void log_info(const char* msg) {
    if (logger_mode >= 0) {
        printf(CLR_GRN "[INFO]" CLR_RESET " %s\n", msg);
    }
};