# OpenID4VP - Obtain Authorization Request by Reference Support

## Introduction

The OpenID4VP specification allows the Verifier to send Authorizaton Request by reference. This means that instead of sending the entire authorization request as part of the URL, a reference to the request can be sent. This can help reduce the size of the URL and improve security by not exposing sensitive information.