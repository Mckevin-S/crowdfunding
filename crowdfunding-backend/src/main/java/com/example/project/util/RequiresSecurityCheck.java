package com.example.project.util;

import java.lang.annotation.*;

/**
 * Annotation to mark methods that require security validation and logging.
 * Can be applied to methods that perform sensitive operations.
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@Documented
public @interface RequiresSecurityCheck {
    
    /**
     * Description of the sensitive operation
     */
    String value() default "";
    
    /**
     * Whether to log method arguments
     */
    boolean logArguments() default false;
    
    /**
     * Roles required to execute this operation
     */
    String[] roles() default {};
}
