## Image hosting options for TimelineJS

Note: this document is far from exhaustive. Any standard web hosting service that allows you to upload and serve files will do,
provided they do not place cross-domain restrictions on the hosting. This document contains some of the more popular options.

## Free options

Most of the services listed in this document are paid services. The following are known to have free tiers or free service levels that may be sufficient for your needs:

  * Flickr
  * Instagram
  * Google Photo
  * GitHub
  * AWS S3 and EC2
  
See below for more information about each of these. Please exercise due diligence in researching costs for whatever platform
you choose. Some services, for example, will charge for data transfer, meaning hits to a popular Timeline could add up.

## Service types

There are 3 main categories of services that will be covered below:

1. Image hosting services
2. Object/file hosting services
3. Web hosting/cloud hosting services

### 1. Image hosting services

#### Flickr

https://www.flickr.com/

Use the URL of the image page.

#### Instagram

https://www.instagram.com/

Use the URL of the image page.

#### Google Photo (ie. photos.google.com, Not Google Drive)

https://photos.google.com/

Note: do not use the share link or image URL. Instead, open the specific image and right-click the image to get the link.

#### *Not Recommended:* Imgur

https://imgur.com/

Although the image URL from Imgur is supported as a media type in Timeline, we no longer recommend Imgur as an image hosting
service for Timeline. Imgur has increasingly been placing cross-domain restrictions on their images. This is not something we
have control over, but would have to be addressed with Imgur support. If you are experiencing issues with Imgur images not
loading, the easiest thing to do is to use a different service.

### 2. Object/file hosting services

#### *Not Recommended:* Dropbox

Dropbox no longer hosts images in a way that is compatible with Timeline.

#### Box (experimental)

https://box.com/

Experimental: It should work, but your mileage may vary. To use a Box hosted image:

 * Click the Share button to open the share dialog for the image.
 * Select Enable Shared Link.
 * Be sure permissions are set to: People with the link can view and download.
 * Copy the link. Do not paste this link in your spreadsheet, but open it in a browser window.
 * Right click the image in the viewer and copy the image location. Paste this location into your spreadsheet.
 
#### GitHub

https://github.com/

Note: we have not checked, but other revision control system / repository platforms may have similar ability. Take a look, for example, at GitLab and Bitbucket.

  * Navigate to the image in the repository
  * Click the download button to open the raw image URL. Paste this URL into your spreadsheet.

#### Amazon Web Services S3

https://aws.amazon.com/s3/

#### DigitalOcean Spaces

https://www.digitalocean.com/products/spaces/

Not tested, but expected to work

#### Firebase cloud storage

https://firebase.google.com/docs/storage

Not tested, but expected to work

#### Google Cloud Platform storage

https://cloud.google.com/storage/

GCP seems to offer a number of different storage options. We have not tested this, but Cloud Storage (Browser storage) seems likely to be the right option here.


### 3. Web hosting services (and cloud hosting services)

#### Web hosting services

There are thousands of these. If you are using this option, you probably are not reading this document. Any standard web
hosting service should do. Most allow you to upload your images either via FTP or SSH/scp. Some provide a dashboard for
uploading files. There are too many options to list here. Everyone has their favorite. They are mostly pretty similar.

#### Cloud hosting services

 * Amazon Web Services EC2: We use EC2 for web hosting in the Lab, but AWS is a complex platform for beginners. Also, see the S3 option above as it is probably a better option than EC2.
 * DigitalOcean is a great service that provides a nice balance between service offerings (virtual hosting, object storage,
managed databases) and complexity (it is not nearly as overwhelming as AWS). Their web hosting virtual-machine service is called Droplets, although, also see the DigitalOcean Spaces object storage option above.
 * Google Cloud Platform: Image files can be hosted from VM instances in Compute Engine, but also see notes for GCP above in the object storage solutions section.

