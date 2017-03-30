#include <stdio.h>

#include "logger.h"
#include "colors.h"

void set_logger_mode(int mode) {
    if (mode < 4) {
        logger_mode = mode;
    } else {
        printf("Not setting invalid logger mode, defaulting to LOG_MODE_INFO");
        logger_mode = LOG_MODE_INFO;
    }
};
void log_info(const char* msg) {
    if (logger_mode >= LOG_MODE_INFO) {
        printf(CLR_GRN "[INFO]" CLR_RESET CLR_WHT " %s" CLR_RESET "\n", msg);
    }
};
void log_infod(const char* msg, int i_) {
    if (logger_mode >= LOG_MODE_INFO) {
        printf(CLR_GRN "[INFO]" CLR_RESET CLR_WHT " %s%d" CLR_RESET "\n", msg, i_);
    }
};
void log_warn(const char* msg) {
    if (logger_mode >= LOG_MODE_WARN) {
        printf(CLR_YEL "[WARN]" CLR_RESET CLR_WHT " %s" CLR_RESET "\n", msg);
    }
};
void log_debug(const char* msg) {
    if (logger_mode >= LOG_MODE_DEBUG) {
        printf(CLR_CYN "[WARN]" CLR_RESET CLR_WHT " %s" CLR_RESET "\n", msg);
    }
};
void log_all(const char* msg) {
    if (logger_mode > LOG_MODE_ALL) {
        printf(CLR_MAG "[ALL]" CLR_RESET CLR_WHT " %s" CLR_RESET "\n", msg);
    }
};
void log_error(const char* msg) {
    printf(CLR_RED "[ALL]" CLR_RESET CLR_WHT " %s" CLR_RESET "\n", msg);
};
void log_fatal(const char* msg) {
    printf(CLR_RED "[FATAL]" CLR_RESET CLR_WHT " %s" CLR_RESET "\n", msg);
}