/**
 * Servicio de validación centralizado
 * Valida tipos, longitudes, formatos y sanitiza inputs
 */

export class ValidationService {
  /**
   * Validar que un string no esté vacío y tenga longitud válida
   */
  validateString(
    value: unknown,
    fieldName: string,
    options: { minLength?: number; maxLength?: number; required?: boolean } = {}
  ): { valid: boolean; error?: string } {
    const { minLength = 1, maxLength = 500, required = true } = options;

    // Verificar tipo
    if (typeof value !== 'string') {
      return { valid: false, error: `${fieldName} debe ser un string` };
    }

    // Verificar que no esté vacío si es requerido
    if (required && value.trim().length === 0) {
      return { valid: false, error: `${fieldName} es requerido` };
    }

    // Verificar longitud
    if (value.trim().length < minLength) {
      return {
        valid: false,
        error: `${fieldName} debe tener al menos ${minLength} caracteres`,
      };
    }

    if (value.trim().length > maxLength) {
      return {
        valid: false,
        error: `${fieldName} no puede exceder ${maxLength} caracteres`,
      };
    }

    return { valid: true };
  }

  /**
   * Validar que un número es válido
   */
  validateNumber(
    value: unknown,
    fieldName: string,
    options: { min?: number; max?: number; required?: boolean } = {}
  ): { valid: boolean; error?: string } {
    const { required = true } = options;

    if (typeof value !== 'number') {
      return { valid: false, error: `${fieldName} debe ser un número` };
    }

    if (required && isNaN(value)) {
      return { valid: false, error: `${fieldName} es requerido` };
    }

    if (options.min !== undefined && value < options.min) {
      return {
        valid: false,
        error: `${fieldName} debe ser mayor o igual a ${options.min}`,
      };
    }

    if (options.max !== undefined && value > options.max) {
      return {
        valid: false,
        error: `${fieldName} debe ser menor o igual a ${options.max}`,
      };
    }

    return { valid: true };
  }

  /**
   * Validar UUID v4
   */
  validateUUID(value: unknown, fieldName: string): { valid: boolean; error?: string } {
    if (typeof value !== 'string') {
      return { valid: false, error: `${fieldName} debe ser un string` };
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!uuidRegex.test(value)) {
      return { valid: false, error: `${fieldName} no es un UUID válido` };
    }

    return { valid: true };
  }

  /**
   * Sanitizar string (remover caracteres peligrosos)
   */
  sanitizeString(value: string): string {
    // Remover espacios en blanco al inicio y final
    let sanitized = value.trim();

    // Remover caracteres de control (pero mantener saltos de línea)
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    return sanitized;
  }

  /**
   * Validar un objeto contra un esquema
   */
  validateObject(
    data: Record<string, unknown>,
    schema: Record<string, { type: string; required?: boolean; minLength?: number; maxLength?: number }>
  ): { valid: boolean; errors: Record<string, string> } {
    const errors: Record<string, string> = {};

    for (const [fieldName, fieldSchema] of Object.entries(schema)) {
      const value = data[fieldName];
      const isRequired = fieldSchema.required ?? true;

      // Si el campo es opcional y no fue proporcionado, saltarlo
      if (!isRequired && (value === undefined || value === null || value === '')) {
        continue;
      }

      if (fieldSchema.type === 'string') {
        const validation = this.validateString(value, fieldName, {
          required: isRequired,
          minLength: fieldSchema.minLength,
          maxLength: fieldSchema.maxLength,
        });

        if (!validation.valid && validation.error) {
          errors[fieldName] = validation.error;
        }
      } else if (fieldSchema.type === 'number') {
        const validation = this.validateNumber(value, fieldName, {
          required: isRequired,
        });

        if (!validation.valid && validation.error) {
          errors[fieldName] = validation.error;
        }
      } else if (fieldSchema.type === 'uuid') {
        const validation = this.validateUUID(value, fieldName);

        if (!validation.valid && validation.error) {
          errors[fieldName] = validation.error;
        }
      }
    }

    return { valid: Object.keys(errors).length === 0, errors };
  }
}

export default new ValidationService();
