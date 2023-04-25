# Guidelines

The following are some guidlines for image and data formatting to help keep the database fast, consistent, and easy to maintain

## Images
* Hero Image
  * filename: *WheelId*-01.jpg
  * style: Front or 3/4 view of wheel on studio background with ~10% padding (*ie: 60px of whitespace around wheel for a 600×600px image*)
  * resolution: 600×600px
  * size: <100kb
* Other Images
  * filename: *WheelId*-##.jpg
  * size: <100kb

## Database
* id: Assigned (*and removed*) from IDLIST.md
* shortname: Typically brand and model
* description: Short description of the wheel, its lineage or history, and/or its applications
* brand: Brand name
* model: Model name
* manufacturer: Legal name of company that physically manufactured the wheel
* yearStart: Earliest known reference in catalog or production date
* yearEnd: Lastest known reference in catalog or production date
* origin: Country of manufacture
* construction: Method of construction (*should match values from pre-populated construction filter*)
* style: Style of wheel (*should match values from pre-populated style filter*)
* link: Link to webpage with more information (*usually an archived copy of the brand's website*)
* images: Array of URLs of images (*images should be hosted in the images folder using the filename convention discussed above*)
* sizes: A list of available sizes
  * diameter: Wheel diameter in inches
  * width: Width in inches
  * pcd: For wheels with multi PCD write out all PCDs in full in ascending order separated by a forward slash (*ie: 4x114.3/5x114.3*) for wheels with multi holes at the same PCD only write the basic fitment (*ie: 4x100 not 8x100*)
  * offsets: Forward slash separated list of all offsets for the given diameter, width, and pcd (*may need to be separated if color availability changes per offset*)
  * colors: Forward slash separated list of all colors for the given diameter, width, pcd, and offsets
