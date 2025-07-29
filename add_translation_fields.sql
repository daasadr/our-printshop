-- SQL skript pre pridanie prekladových polí do Directus
-- Spustiť v Directus databázi

-- Pridanie prekladových polí pre názvy produktov
ALTER TABLE products ADD COLUMN name_cs TEXT;
ALTER TABLE products ADD COLUMN name_sk TEXT;
ALTER TABLE products ADD COLUMN name_en TEXT;
ALTER TABLE products ADD COLUMN name_de TEXT;

-- Pridanie prekladových polí pre popisy produktov
ALTER TABLE products ADD COLUMN description_cs TEXT;
ALTER TABLE products ADD COLUMN description_sk TEXT;
ALTER TABLE products ADD COLUMN description_en TEXT;
ALTER TABLE products ADD COLUMN description_de TEXT;

-- Pridanie prekladových polí pre design_info
ALTER TABLE products ADD COLUMN design_info_cs TEXT;
ALTER TABLE products ADD COLUMN design_info_sk TEXT;
ALTER TABLE products ADD COLUMN design_info_en TEXT;
ALTER TABLE products ADD COLUMN design_info_de TEXT;

-- Pridanie prekladových polí pre product_info
ALTER TABLE products ADD COLUMN product_info_cs TEXT;
ALTER TABLE products ADD COLUMN product_info_sk TEXT;
ALTER TABLE products ADD COLUMN product_info_en TEXT;
ALTER TABLE products ADD COLUMN product_info_de TEXT;

-- Vytvorenie indexov pre lepší výkon
CREATE INDEX idx_products_name_cs ON products(name_cs);
CREATE INDEX idx_products_name_sk ON products(name_sk);
CREATE INDEX idx_products_name_en ON products(name_en);
CREATE INDEX idx_products_name_de ON products(name_de);

-- Komentáre pre lepšiu dokumentáciu
COMMENT ON COLUMN products.name_cs IS 'Czech translation of product name';
COMMENT ON COLUMN products.name_sk IS 'Slovak translation of product name';
COMMENT ON COLUMN products.name_en IS 'English translation of product name';
COMMENT ON COLUMN products.name_de IS 'German translation of product name';

COMMENT ON COLUMN products.description_cs IS 'Czech translation of product description';
COMMENT ON COLUMN products.description_sk IS 'Slovak translation of product description';
COMMENT ON COLUMN products.description_en IS 'English translation of product description';
COMMENT ON COLUMN products.description_de IS 'German translation of product description';

COMMENT ON COLUMN products.design_info_cs IS 'Czech translation of design info';
COMMENT ON COLUMN products.design_info_sk IS 'Slovak translation of design info';
COMMENT ON COLUMN products.design_info_en IS 'English translation of design info';
COMMENT ON COLUMN products.design_info_de IS 'German translation of design info';

COMMENT ON COLUMN products.product_info_cs IS 'Czech translation of product info';
COMMENT ON COLUMN products.product_info_sk IS 'Slovak translation of product info';
COMMENT ON COLUMN products.product_info_en IS 'English translation of product info';
COMMENT ON COLUMN products.product_info_de IS 'German translation of product info'; 