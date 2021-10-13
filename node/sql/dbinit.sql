CREATE TABLE block
(
    number integer NOT NULL,
    block_timestamp TIMESTAMP NOT NULL,
    gasUsed bigint NOT NULL,
    CONSTRAINT block_pkey PRIMARY KEY (number)
);

CREATE TABLE block_transaction
(
    hash VARCHAR(128) NOT NULL,
    block_number integer NOT NULL,
    CONSTRAINT transaction_pkey PRIMARY KEY (hash)
);