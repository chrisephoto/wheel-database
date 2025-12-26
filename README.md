# Wheel Database

I created this to serve as a searchable database of Japanese brand wheels - especially those less known, including photos and specifications of each wheel. This was heavily inspired by the work done at [Kyusha Shoes](https://www.kyushashoes.com).

I do not claim this database to be complete or comprehensive but I do intend to make sure all of the data is as accurate as possible. Most of this data has been gathered from archives of the manufacturers websites and books such as Holiday Auto, Gold Car Top, and HyperRev.

If you find this resource helpful and would like to support this project feel free to [buy me a coffee](https://paypal.me/chrisephoto).

[View the live site](https://chrisephoto.github.io/wheel-database/)

## Changelog

**2025-12-28**
* CSS updates:
  * Separated radius variable into small and large variants for more control over UI elements
  * Adjusted padding on input elements
  * Removed list display
  * Made wheel name visible at all times in wheel grid and related wheels sections
* HTML updates:
  * Replaced shortname with brand and model in grid, detail hero, and related wheels sections
  * Added searchable tags to Wheel detail hero
  * Added clickable filters to Brand and Manufacturer in Wheel Information table
  * Moved "Colors" from Specifications table to Information table
    * Pros: less text to manage and display makes for easier editing of database and easier viewing on mobile
    * Cons: colors are no longer tracked by size - in the rare instances where all colors are not available on all sizes, this information is almost always included in the external references anyway
  * Removed Construction filter as this has been incorporated into the tags
* Database updates:
  * Updated Carving Cismarino Pietra image
  * Updated Carving Cismarino Questa image
  * Adjusted wording of various descriptions to avoid false positives in search results
* Moved future wheels list to [Google Drive](https://docs.google.com/spreadsheets/d/1kgS54kk9Nsk1QXrK9YDOe4IY8-_SrFcPy_TL1XSIVDY/edit?usp=sharing)

**2025-10-19**
* Added:
  * 5Zigen FN-01R
  * 5Zigen FN01R-C
  * 5Zigen FN01R-C Hot Version
  * 5Zigen GN+
  * Carving Cismarino Pietra
  * Carving Cismarino Questra
  * Direzza RSC

**2025-07-22**
* Added:
  * Mugen MC10L
  * Mugen MF10L
* Updated:
  * Uras NS-02

**2025-07-15**
* Added filter parameters to URL so filtered results can be bookmarked/shared
* Added text search filter
* Updated filter logic to auto populate brands and manufacturers
* Added remaining filters directly to HTML
* Removed `filters.js`
* Added:
  * Hinodex Aguzze S-07
  * Hinodex Aguzze S-07R
  * Modex KS-CE
* Updated:
  * Yokohama Connoisseur No. 51C

**2025-07-09**
* Updated links Javascript to prevent page reload
* Updated all hero images to "00.png" with transparent background
* Updated:
  * Real Racing Model II
  * Real Racing R2
  * Uras NS-01
  * Uras NS-02
  * Yokohama Connoisseur No. 51C
* Added:
  * WedsSport TC-05
  * WedsSport TC-005

**2025-07-06**
* Significant redesign of page layout and details modal behavior to better suit larger screens
* Added toggle to change between grid and list view

**2025-07-03**
* Added:
  * Yokohama Connoisseur No. 51C
  * EuroMagic Racing ST-05Air

**2025-04-21**
* Added:
  * B.I.M. Down Hill Special ae051
  * B.I.M. Down Hill Special ae081
  * New Rayton EuroMagic GT-08F
* Tweaked some CSS styles to make things more mobile friendly
* Reorganized images to make files easier to browse and simplify `database.js`
* Removed some unnecessary files


**2025-04-19**
* Made the specification table scrollable on mobile
* Added 2/3 piece welded construction - details will be written in the wheel summary
* Updated various wheel entries

**2024-12-09**
* Changelog started
 
