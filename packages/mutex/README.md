# [Mutex](https://tscommon.github.io/monorepo/primitives/async/mutex) - [API](https://tscommon.github.io/monorepo/api/mutex/class/Mutex)

[![codecov](https://codecov.io/gh/tscommon/monorepo/graph/badge.svg?token=I222OQNV9L)](https://codecov.io/gh/tscommon/monorepo)

A mutual exclusion primitive useful for protecting shared data.

This mutex will block async contexts waiting for the lock to become available. The mutex can be created via a new constructor. Each mutex has a type parameter which represents the data that it is protecting. The data can only be accessed through the RAII guards returned from `lock` and `tryLock`, which guarantees that the data is only ever accessed when the mutex is locked.
