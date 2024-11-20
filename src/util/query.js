const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_PAGE = 1;

class QueryBuilder {
  constructor({ model, searchFields, sortKey, nullishSort }) {
    this.model = model;
    this.query = {
      where: {},
    };
    this.pagination = {};
    this.searchFields = searchFields || [];
    this.sortKey = sortKey || "";
    this.nullishSort = nullishSort === "true" ? true : false;
    this.selectFields = [];
    this.includeRelations = [];
    this.selectIncludes = {};
  }

  filter(filterObject) {
    if (filterObject.search) {
      const searchFilters = this.searchFields.map((field) => ({
        [field]: {
          contains: filterObject.search.trim(),
          mode: "insensitive",
        },
      }));
      this.query.where.OR = searchFilters;
      delete filterObject.search;
    }

    this.query.where = {
      ...this.query.where,
      ...filterObject,
    };

    return this;
  }

  filterIn(filterObject) {
    for (const key in filterObject) {
      if (Object.hasOwnProperty.call(filterObject, key)) {
        if (filterObject[key]) {
          this.query.where = {
            ...this.query.where,
            [key]: {
              in: filterObject[key].split(","),
            },
          };
        }
        delete filterObject[key];
      }
    }

    return this;
  }

  sort(sortOption) {
    const sortOptions = {
      latest: {
        [this.sortKey]: this.nullishSort
          ? { sort: "desc", nulls: "last" }
          : "desc",
      },
      oldest: {
        [this.sortKey]: this.nullishSort
          ? { sort: "asc", nulls: "last" }
          : "asc",
      },
      highest: {
        [this.sortKey]: this.nullishSort
          ? { sort: "desc", nulls: "last" }
          : "desc",
      },
      lowest: {
        [this.sortKey]: this.nullishSort
          ? { sort: "asc", nulls: "last" }
          : "asc",
      },
      aToZ: {
        [this.sortKey]: this.nullishSort
          ? { sort: "asc", nulls: "last" }
          : "asc",
      },
      zToA: {
        [this.sortKey]: this.nullishSort
          ? { sort: "desc", nulls: "last" }
          : "desc",
      },
    };

    this.query.orderBy = sortOption
      ? sortOptions[sortOption]
      : this.sortKey
      ? {
          [this.sortKey]: "desc",
        }
      : { createdAt: "desc" };

    return this;
  }

  sortNested(sortOption) {
    this.query.orderBy = sortOption;

    return this;
  }

  paginate(pageNumber = DEFAULT_PAGE, pageSize = DEFAULT_PAGE_SIZE) {
    this.pagination = {
      skip: Math.max(0, (pageNumber - 1) * pageSize),
      take: Math.max(1, pageSize),
    };
    return this;
  }

  select(fields) {
    this.selectFields = fields;
    return this;
  }

  include(relations) {
    this.includeRelations = relations;
    return this;
  }

  selectWithIncludes(nestedFields) {
    this.selectIncludes = nestedFields;
    return this;
  }

  generateSelectObject() {
    if (this.selectFields.length) {
      return this.selectFields.reduce((acc, field) => {
        acc[field] = true;
        return acc;
      }, {});
    }
    return undefined;
  }

  generateIncludeObject() {
    if (this.includeRelations.length) {
      return this.includeRelations.reduce((acc, relation) => {
        acc[relation] = true;
        return acc;
      }, {});
    }
    return undefined;
  }

  async execute() {
    const { skip, take } = this.pagination;

    const query = {
      where: this.query.where,
      orderBy: this.query.orderBy,
      skip,
      take,
      select: this.generateSelectObject() || this.selectIncludes,
      include: this.generateIncludeObject(),
    };

    const [results, totalCount] = await Promise.all([
      this.model.findMany(query),
      this.model.count({ where: this.query.where }),
    ]);

    const totalPages = Math.ceil(totalCount / take);

    return { results, totalCount, totalPages };
  }

  avg(selectFields) {
    this.query._avg = selectFields.reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});

    return this;
  }

  count(selectField) {
    this.query._count = {
      [selectField]: true,
    };

    return this;
  }

  async executeGroupBy(fields) {
    const { skip, take } = this.pagination;

    const query = {
      by: fields,
      ...this.query,
      skip,
      take,
    };

    const result = await this.model.groupBy(query);

    return result;
  }
}

module.exports = { QueryBuilder };
