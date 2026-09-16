import proxy from "express-http-proxy"


export const proxyWithHeaders = (serviceUrl)=>{
    return proxy(
        serviceUrl,
        {
            proxyReqOptDecorator: (proxyReqOpts, srcReq)=>{
                if(srcReq.user){
                    proxyReqOpts.headers["x-user-id"] = srcReq.user.userId;
                }
                return proxyReqOpts;
            },

            proxyErrorHandler:(err,res,next)=>{
                console.error(`Proxy error for ${serviceUrl}:`, err.message);

                res.status(503).json({
                    message:"Service temporarily unavailable"
                })
            }
        }
    )
}