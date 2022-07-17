# import pandas as pd
# import numpy as np
import os
import time
import json
from nilearn.image.image import mean_img
from nilearn.plotting import plot_epi, show

def get_job_details():
    """Reads in metadata information about assets used by the algo"""
    job = dict()
    job['dids'] = json.loads(os.getenv('DIDS', None))
    job['metadata'] = dict()
    job['files'] = dict()
    job['algo'] = dict()
    job['secret'] = os.getenv('secret', None)
    algo_did = os.getenv('TRANSFORMATION_DID', None)
    if job['dids'] is not None:
        for did in job['dids']:
            # get the ddo from disk
            filename = '/data/ddos/' + did
            print(f'Reading json from {filename}')
            with open(filename) as json_file:
                ddo = json.load(json_file)
                # search for metadata service
                for service in ddo['services']:
                    if service['type'] == 'compute':
                        job['files'][did] = list()
                        print(type(service['files']))
                        if type(service['files']) == str:
                            job['files'][did].append('/data/inputs/' + did + '/0')
                        else:
                            index = 0
                            for file in service['files']:
                                job['files'][did].append(
                                    '/data/inputs/' + did + '/' + str(index))
                                index = index + 1
    if algo_did is not None:
        job['algo']['did'] = algo_did
        job['algo']['ddo_path'] = '/data/ddos/' + algo_did
    return job


def log_job_details(job_details):
    """Executes the line counter based on inputs"""
    print('Starting compute job with the following input information:')
    print(json.dumps(job_details, sort_keys=True, indent=4))
    first_did = job_details['dids'][0]
    filename = job_details['files'][first_did][0]
   
    # Compute the mean EPI: we do the mean along the axis 3, which is time
    mean_haxby = mean_img(filename)

    plot_epi(mean_haxby, output_file='/data/outputs/result.png', colorbar=True, cbar_tick_format="%i")

def list_files(startpath):
    for root, dirs, files in os.walk(startpath):
        level = root.replace(startpath, '').count(os.sep)
        indent = ' ' * 4 * (level)
        print('{}{}/'.format(indent, os.path.basename(root)))
        subindent = ' ' * 4 * (level + 1)
        for f in files:
            print('{}{}'.format(subindent, f))

if __name__ == '__main__':
    # list_files(os.getcwd())
    log_job_details(get_job_details())