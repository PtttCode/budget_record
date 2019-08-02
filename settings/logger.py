import os
import logging, threading
import traceback
import logging.handlers


class Logger(object):
    uid = ''
    show_source_location = True

    def __init__(self, level="INFO", name="root"):
        # debug log
        self.log = logging.getLogger(name)

    def _raw_log(self, logfn, message, exc_info):
        cname = ''
        loc = ''
        fn = ''
        tb = traceback.extract_stack()
        if len(tb) > 2:
            if self.show_source_location:
                loc = '(%s:%d):' % (os.path.basename(tb[-3][0]), tb[-3][1])
            fn = tb[-3][2]
            if fn != '<module>':
                if self.__class__.__name__ != Logger.__name__:
                    fn = self.__class__.__name__ + '.' + fn
                fn += '()'
        # logfn(self.uid + loc + cname + fn + ': ' + str(message), exc_info=exc_info)
        logfn(u"{}{}{}: {}".format(loc, cname, fn, message), exc_info=exc_info)

    def info(self, message, exc_info=False):
        """
        Log a info-level message. If exc_info is True, if an exception
        was caught, show the exception information (message and stack trace).
        """
        self._raw_log(self.log.info, message, exc_info)

    def warning(self, message, exc_info=False):
        """
        Log a warning-level message. If exc_info is True, if an exception
        was caught, show the exception information (message and stack trace).
        """
        self._raw_log(self.log.warning, message, exc_info)

    def error(self, message, exc_info=False):
        """
        Log an error-level message. If exc_info is True, if an exception
        was caught, show the exception information (message and stack trace).
        """
        self._raw_log(self.log.error, message, exc_info)
