# Blinkit Category Discovery - Aggregation Dashboard

**Total Items Analyzed**: 372

## 1. High-Level Distributions

### Overall Sentiment

|    | Sentiment   |   Count |
|---:|:------------|--------:|
|  0 | negative    |     294 |
|  1 | positive    |      59 |
|  2 | neutral     |      17 |

### User Segments

|    | Segment Signal       |   Count |
|---:|:---------------------|--------:|
|  0 | unclear              |     175 |
|  1 | loyalist-repeat-only |      81 |
|  2 | cautious-explorer    |      62 |
|  3 | deal-driven          |      34 |
|  4 | active-explorer      |      18 |

### Categories Mentioned

|    | Category             |   Count |
|---:|:---------------------|--------:|
|  0 | none                 |     206 |
|  1 | grocery              |      93 |
|  2 | electronics          |      34 |
|  3 | personal care        |      11 |
|  4 | apparel              |       4 |
|  5 | snacks               |       4 |
|  6 | household essentials |       3 |
|  7 | stationery           |       3 |
|  8 | groceries            |       3 |
|  9 | daily essentials     |       2 |
| 10 | home appliances      |       2 |
| 11 | gifts                |       2 |
| 12 | medicine             |       2 |
| 13 | services             |       1 |
| 14 | fresh items          |       1 |
| 15 | plants               |       1 |
| 16 | home decor           |       1 |
| 17 | baby care            |       1 |
| 18 | diapers              |       1 |
| 19 | everyday shopping    |       1 |
| 20 | ice cream            |       1 |
| 21 | crafts               |       1 |
| 22 | essentials           |       1 |
| 23 | fruits               |       1 |
| 24 | vegetables           |       1 |
| 25 | dairy                |       1 |
| 26 | luggage-bags         |       1 |
| 27 | home utility         |       1 |
| 28 | flowers              |       1 |
| 29 | books                |       1 |
| 30 | meat-fish            |       1 |
| 31 | home goods           |       1 |
| 32 | beauty               |       1 |
| 33 | pet care             |       1 |
| 34 | pharmacy             |       1 |
| 35 | luggage              |       1 |
| 36 | household items      |       1 |
| 37 | kitchen appliances   |       1 |
| 38 | cherries             |       1 |
| 39 | essential items      |       1 |
| 40 | milk                 |       1 |
| 41 | appliances           |       1 |
| 42 | printout             |       1 |
| 43 | clothing             |       1 |
| 44 | household            |       1 |

## 2. Behavioral Triggers & Frictions

### Purchase Triggers (Why they buy new categories)

|    | Trigger               |   Count |
|---:|:----------------------|--------:|
|  0 | none                  |     242 |
|  1 | habit                 |      59 |
|  2 | urgent-need           |      48 |
|  3 | promo-discount        |      14 |
|  4 | accidental            |       5 |
|  5 | algorithmic-discovery |       2 |

### Frictions (Why they avoid new categories)

|    | Friction               |   Count |
|---:|:-----------------------|--------:|
|  0 | trust-quality          |     216 |
|  1 | price-sensitivity      |      67 |
|  2 | app-ux-findability     |      64 |
|  3 | none                   |      54 |
|  4 | delivery-time-doubt    |      42 |
|  5 | category-unfamiliarity |       5 |

## 3. Cross-Tabulations (Correlations)

### Friction Type vs Segment Signal

| friction_type          |   active-explorer |   cautious-explorer |   deal-driven |   loyalist-repeat-only |   unclear |
|:-----------------------|------------------:|--------------------:|--------------:|-----------------------:|----------:|
| app-ux-findability     |                 0 |                  10 |             7 |                      6 |        41 |
| category-unfamiliarity |                 0 |                   2 |             0 |                      3 |         0 |
| delivery-time-doubt    |                 1 |                   2 |             2 |                      5 |        32 |
| none                   |                13 |                   0 |             0 |                     34 |         7 |
| price-sensitivity      |                 1 |                  11 |            31 |                     13 |        11 |
| trust-quality          |                 4 |                  53 |             8 |                     36 |       115 |

### Trigger Type vs Sentiment

| trigger_type          |   negative |   neutral |   positive |
|:----------------------|-----------:|----------:|-----------:|
| accidental            |          4 |         0 |          1 |
| algorithmic-discovery |          0 |         0 |          2 |
| habit                 |         23 |         4 |         32 |
| none                  |        225 |         9 |          8 |
| promo-discount        |         14 |         0 |          0 |
| urgent-need           |         28 |         4 |         16 |

