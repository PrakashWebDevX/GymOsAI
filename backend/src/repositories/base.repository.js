import { supabaseAdmin } from '../config/supabase.js';
import { NotFoundError } from '../utils/errors.js';

export class BaseRepository {
  constructor(tableName) {
    this.table = tableName;
    this.db = supabaseAdmin;
  }

  async findById(id) {
    const { data, error } = await this.db
      .from(this.table)
      .select('*')
      .eq('id', id)
      .single();
    if (error) throw error;
    return data;
  }

  async findByUserId(userId, options = {}) {
    let query = this.db.from(this.table).select('*').eq('user_id', userId);
    if (options.orderBy) {
      query = query.order(options.orderBy, { ascending: options.ascending ?? false });
    }
    if (options.limit) query = query.limit(options.limit);
    if (options.offset) query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async create(record) {
    const { data, error } = await this.db
      .from(this.table)
      .insert(record)
      .select()
      .single();
    if (error) throw error;
    return data;
  }

  async update(id, updates) {
    const { data, error } = await this.db
      .from(this.table)
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    if (!data) throw new NotFoundError(`${this.table} not found`);
    return data;
  }

  async delete(id) {
    const { error } = await this.db.from(this.table).delete().eq('id', id);
    if (error) throw error;
  }
}
