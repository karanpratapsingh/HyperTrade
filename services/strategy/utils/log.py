import logging


class Logger:
    @staticmethod
    def get():
        logging.basicConfig(
            level=logging.DEBUG,
            format='%(asctime)s %(levelname)s %(module)s %(message)s',
            datefmt='%d-%b-%y %I:%M%p',
        )

        return logging
