CREATE TABLE block
(
    number integer NOT NULL,
    block_timestamp timestamp NOT NULL,
    gasUsed bigint NOT NULL,
    CONSTRAINT block_pkey PRIMARY KEY (number)
)