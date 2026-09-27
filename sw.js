const CACHE_NAME = "rere-note-v4";

const APP_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./logo.jpg"
];


/* =========================================
   INSTALL
========================================= */

self.addEventListener("install", event => {

    event.waitUntil(

        caches.open(CACHE_NAME)
            .then(cache => {

                return cache.addAll(APP_FILES);

            })

    );

    self.skipWaiting();

});


/* =========================================
   ACTIVATE
========================================= */

self.addEventListener("activate", event => {

    event.waitUntil(

        caches.keys()
            .then(cacheNames => {

                return Promise.all(

                    cacheNames.map(cacheName => {

                        if (
                            cacheName !== CACHE_NAME
                        ) {

                            return caches.delete(
                                cacheName
                            );

                        }

                        return null;

                    })

                );

            })

            .then(() => {

                return self.clients.claim();

            })

    );

});


/* =========================================
   FETCH
========================================= */

self.addEventListener("fetch", event => {

    if (
        event.request.method !== "GET"
    ) {

        return;

    }


    const requestURL =
        new URL(
            event.request.url
        );


    /*
       Hanya tangani file aplikasi
       yang berasal dari folder Rere Note.
    */

    if (
        requestURL.origin !==
        self.location.origin
    ) {

        return;

    }


    event.respondWith(

        fetch(event.request)
            .then(response => {

                /*
                   Kalau berhasil mengambil
                   versi terbaru dari server,
                   simpan ke cache.
                */

                if (
                    response &&
                    response.status === 200 &&
                    response.type === "basic"
                ) {

                    const responseClone =
                        response.clone();


                    caches.open(CACHE_NAME)
                        .then(cache => {

                            cache.put(
                                event.request,
                                responseClone
                            );

                        });

                }


                return response;

            })

            .catch(() => {

                /*
                   Kalau offline,
                   gunakan cache.
                */

                return caches.match(
                    event.request
                )
                .then(cachedResponse => {

                    if (cachedResponse) {

                        return cachedResponse;

                    }


                    return caches.match(
                        "./index.html"
                    );

                });

            })

    );

});
