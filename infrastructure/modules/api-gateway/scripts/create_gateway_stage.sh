#!/bin/bash
set -e

if [[ "$(aws apigateway get-stages --rest-api ${API} --query "item[?stageName=='${STAGE}']")" == "[]" ]]; then
  aws apigateway create-stage --rest-api-id ${API} --stage-name ${STAGE} --deployment-id ${DEPLOYMENT}
else
  aws apigateway update-stage --rest-api-id ${API} --stage-name ${STAGE} --patch-operations "op=replace,path=/deploymentId,value=${DEPLOYMENT}"
fi