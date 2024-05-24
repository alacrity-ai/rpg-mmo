class TaskRegistry {
    constructor() {
      this.registry = {};
    }
  
    register(taskType, handler) {
      if (typeof handler !== 'function') {
        throw new Error(`Handler for task type "${taskType}" must be a function`);
      }
      this.registry[taskType] = handler;
    }
  
    getHandler(taskType) {
      return this.registry[taskType];
    }
  }
  
  const taskRegistry = new TaskRegistry();
  
module.exports = taskRegistry;
  