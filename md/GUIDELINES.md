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
* id: Assigned (*and removed*) from WHEEL-ID.md
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
* sizes:
