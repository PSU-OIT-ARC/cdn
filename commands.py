from runcommands import command
from runcommands.commands import local
from runcommands.util import printer

from emcee.aws.commands import *


@command(env=True)
def deploy_assets(config):
    bucket_name = '{}.{}'.format(config.infrastructure.s3.bucket.name,
                                 config.infrastructure.dns_zone)
    printer.info("Deploying CDN assets to '{}'...".format(bucket_name))
    local(config, ('{venv}/bin/aws', 's3', 'sync', 'cdn/', 's3://{}'.format(bucket_name)))
