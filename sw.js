const cacheName = "v2";

// Call Install Event
self.addEventListener("install", e => {
  console.log("Service Worker: Installed");
});

// Call Activate Event
self.addEventListener("activate", e => {
  console.log("Service Worker: Activated");
  // Remove unwanted caches
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== cacheName) {
            console.log("Service Worker: Clearing Old Cache");
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Call Fetch Event
self.addEventListener("fetch", e => {
  console.log("Service Worker: Fetching");
  e.respondWith(
    caches.open(cacheName).then(cache => {
      return cache.match(e.request).then(matched => {
        if (matched) {
          return matched;
        }
        return fetch(e.request)
          .then(res => {
            // Add response to cache
            cache.put(e.request, res.clone());

            return res;
          })
          .catch(err => console.log(err));
      });
    })
  );
});
