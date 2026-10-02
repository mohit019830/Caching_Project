const cache={}
const time=60*1000

const cacheMiddleware=(req,res,next)=>{
    if(['POST','PUT','PATCH','DELETE'].includes(req.method)){
        for(let key in cache){
            delete cache[key]
        }
        return next()
    }

    const key=req.url
    const value=cache[key]
    const now=Date.now()

    if(value && (now-value.timestamp<time)){
        res.setHeader('Cache','HIT')
        return res.json(value.data)
    }

    res.setHeader('Cache','MISS')

    const oJson=res.json.bind(res)
    res.json=(body)=>{
        if(res.statusCode>=200 && res.statusCode<300){
            cache[key]={
                data:body,
                timestamp:Date.now()
            };
        }
        return oJson(body)
    };
    next()
};

module.exports=cacheMiddleware;