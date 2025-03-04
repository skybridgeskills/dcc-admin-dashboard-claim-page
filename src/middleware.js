export function onRequest (context, next) {
    // intercept data from a request
    // optionally, modify the properties in `locals`
    context.locals.title = "New title";
    console.log(context.url.hostname)
    // TODO: use hostname to construct link to s3 bucket for white labelling unless it's localhost?

    // return a Response or the result of calling `next()`
    return next();
};
