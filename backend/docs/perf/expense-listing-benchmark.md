# Expense Listing Optimization (N+1 -> 2 queries)

**Change:** Bulk-load shares for all expenseIds instead of per-expense fetch.

**Env:** Dockerized Postgres 16 (`pg_stat_statements`), Spring Boot 3.5, 10 users, 200 expenses, 1000 shares/page, 500 requests.

**Before:** 201 queries/request (expenses + per-expense shares)

- expense_share calls: 100,000
- total exec time (top 2 queries): 2534s

**After:** 2 queries/request (expenses + shares IN (...))

- expense_share calls: 500
- total exec time (top 2 queries): 578s

**Reduction:** 99.5% fewer DB calls, 77% less query exec time.
