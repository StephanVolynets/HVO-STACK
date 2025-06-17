#!/bin/bash

project=$1
name=$2

source_bucket="gs://${project}.appspot.com/exports/${name}"

gcloud config set project $project

gcloud firestore export $source_bucket --async