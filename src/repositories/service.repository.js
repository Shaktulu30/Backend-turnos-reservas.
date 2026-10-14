export default class ServiceRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getAll() {
    return this.dao.getAll();
  }

  getById(id) {
    return this.dao.getById(id);
  }

  create(data) {
    return this.dao.create(data);
  }

  update(id, fields) {
    return this.dao.update(id, fields);
  }

  delete(id) {
    return this.dao.delete(id);
  }

  getPaginated(filter, options) {
    return this.dao.getPaginated(filter, options);
  }
}
