locals {

  incapsula_map = {
    prod        = ["9xfbyuo.x.incapdns.net"]
    integration = ["5tuwvba.x.incapdns.net"]
    preprod     = ["idb53vj.x.incapdns.net"]
  }
  incapsula_env = contains(keys(local.incapsula_map), terraform.workspace)

  redeployment_spec = sha1(jsonencode([
    aws_api_gateway_resource.enquiry,
    aws_api_gateway_resource.enquiry_test_results,
    aws_api_gateway_resource.enquiry_vehicle,
    aws_api_gateway_resource.folder,
    aws_api_gateway_resource.item,
    aws_api_gateway_resource.logs,
    aws_api_gateway_resource.minimum_version,
    aws_api_gateway_resource.feature_flags,
    aws_api_gateway_resource.v1,
    aws_api_gateway_integration.enquiry_test_results,
    aws_api_gateway_integration.enquiry_vehicle,
    aws_api_gateway_integration.s3_options,
    aws_api_gateway_integration.s3_put,
    aws_api_gateway_method.enquiry_test_results,
    aws_api_gateway_method.enquiry_vehicle,
    aws_api_gateway_method.s3_get,
    aws_api_gateway_method.s3_options,
    aws_api_gateway_method.s3_put,
    local.reference_data_response_template,
    local.reference_data_item_response_template
  ]))

  method_response_parameters = {
    "method.response.header.Access-Control-Allow-Methods" : true,
    "method.response.header.Access-Control-Allow-Headers" : true,
    "method.response.header.Access-Control-Allow-Origin" : true
  }

  integration_response_parameters = {
    "method.response.header.Access-Control-Allow-Methods" : "'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT'",
    "method.response.header.Access-Control-Allow-Headers" : "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
    "method.response.header.Access-Control-Allow-Origin" : "'*'"
  }

  reference_data_response_template = {
    "application/json" = <<EOF
     #set($inputRoot = $input.path('$'))
     #if($inputRoot.Items.size() == 0)
      #set($context.responseOverride.status = 404)
     #else
{
    "data": [
      #foreach($elem in $inputRoot.Items)
        {#foreach($item in $elem.entrySet())"$item.key": #if($item.value.S.length() != $null)"$item.value.S"#elseif($item.value.N.length() != $null)$item.value.N#else null#end#if($foreach.hasNext),#end#end}#if($foreach.hasNext && $foreach.count < 1000),#end

      #end
    ]#if($inputRoot.Items.size() > 1000),
    #set($dynamoKey = "{""resourceType"":{""S"":""$inputRoot.Items.get(999).resourceType.S""}, ""resourceKey"":{""S"":""$inputRoot.Items.get(999).resourceKey.S""}}")
"paginationToken":"$util.base64Encode($dynamoKey)"
    #end
}
#end
EOF
  }

  reference_data_item_response_template = {
    "application/json" = <<EOF
     #set($inputRoot = $input.path('$'))
      #if($inputRoot.Item == $null)
      #set($context.responseOverride.status = 404)
     #else
{#foreach($item in $inputRoot.Item.entrySet())"$item.key": #if($item.value.S.length() != $null)"$item.value.S"#elseif($item.value.N.length() != $null)$item.value.N#else null#end#if($foreach.hasNext),#end#end}
#end
EOF
  }
}
