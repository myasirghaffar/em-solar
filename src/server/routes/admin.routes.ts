import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { HttpStatusCode } from '../common/constants/http-status';
import { createDb } from '../db/client';
import { ErrorCodes } from '../common/constants/error-codes';
import { jsonWithRevalidation } from '../lib/http-revalidation';
import { buildErrorResponse, buildSuccessResponse } from '../lib/responses';
import { requireAdmin, requireAuth, type AppBindings, type AppVariables } from '../middleware/auth';
import * as catalog from '../services/catalog.service';
import {
  blogCreateSchema,
  blogUpdateSchema,
  orderStatusUpdateSchema,
  productCategoryCreateSchema,
  productCategoryUpdateSchema,
  productCreateSchema,
  productUpdateSchema,
} from '../validators/schemas';

/** Shop admin API — products, categories, orders, customers, blogs, analytics. */
export const adminRoutes = new Hono<{ Bindings: AppBindings; Variables: AppVariables }>();

adminRoutes.use('*', requireAuth);
adminRoutes.use('*', requireAdmin);

adminRoutes.get('/bootstrap', async (c) => {
  const db = createDb(c.env);
  const [products, productCategories, orders, customers, contactMessages, blogs, storeAnalytics] =
    await Promise.all([
      catalog.listProductsAdmin(db),
      catalog.listProductCategoriesAdmin(db),
      catalog.listOrdersAdmin(db),
      catalog.listCustomersAdmin(db),
      catalog.listContactMessagesAdmin(db),
      catalog.listBlogsAdmin(db),
      catalog.getAnalyticsAdmin(db),
    ]);

  const openMessages = contactMessages.filter(
    (row) => row.status === 'new' || row.status === 'unread',
  ).length;

  return jsonWithRevalidation(
    c,
    buildSuccessResponse({
      products,
      productCategories,
      orders,
      customers,
      contactMessages,
      blogs,
      analytics: {
        ...storeAnalytics,
        openMessages,
      },
    }),
    { cacheControl: 'private, max-age=0, must-revalidate' },
  );
});

adminRoutes.get('/products', async (c) => {
  const db = createDb(c.env);
  const data = await catalog.listProductsAdmin(db);
  return jsonWithRevalidation(c, buildSuccessResponse(data));
});

adminRoutes.post('/products', zValidator('json', productCreateSchema), async (c) => {
  const body = c.req.valid('json');
  const db = createDb(c.env);
  const data = await catalog.createProductAdmin(db, body);
  return c.json(buildSuccessResponse(data), HttpStatusCode.CREATED);
});

adminRoutes.patch('/products/:id', zValidator('json', productUpdateSchema), async (c) => {
  const id = Number(c.req.param('id'));
  if (!Number.isFinite(id) || id < 1) {
    return c.json(
      buildErrorResponse(ErrorCodes.VALIDATION_FAILED, HttpStatusCode.BAD_REQUEST, 'Invalid product id'),
      HttpStatusCode.BAD_REQUEST,
    );
  }
  const body = c.req.valid('json');
  const db = createDb(c.env);
  const data = await catalog.updateProductAdmin(db, id, body);
  return c.json(buildSuccessResponse(data));
});

adminRoutes.put('/products/:id', zValidator('json', productCreateSchema), async (c) => {
  const id = Number(c.req.param('id'));
  if (!Number.isFinite(id) || id < 1) {
    return c.json(
      buildErrorResponse(ErrorCodes.VALIDATION_FAILED, HttpStatusCode.BAD_REQUEST, 'Invalid product id'),
      HttpStatusCode.BAD_REQUEST,
    );
  }
  const body = c.req.valid('json');
  const db = createDb(c.env);
  const data = await catalog.updateProductAdmin(db, id, body);
  return c.json(buildSuccessResponse(data));
});

adminRoutes.delete('/products/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (!Number.isFinite(id) || id < 1) {
    return c.json(
      buildErrorResponse(ErrorCodes.VALIDATION_FAILED, HttpStatusCode.BAD_REQUEST, 'Invalid product id'),
      HttpStatusCode.BAD_REQUEST,
    );
  }
  const db = createDb(c.env);
  await catalog.deleteProductAdmin(db, id);
  return c.json(buildSuccessResponse(null), HttpStatusCode.OK);
});

adminRoutes.get('/product-categories', async (c) => {
  const db = createDb(c.env);
  const data = await catalog.listProductCategoriesAdmin(db);
  return jsonWithRevalidation(c, buildSuccessResponse(data));
});

adminRoutes.post(
  '/product-categories',
  zValidator('json', productCategoryCreateSchema),
  async (c) => {
    const body = c.req.valid('json');
    const db = createDb(c.env);
    const data = await catalog.createProductCategoryAdmin(db, body);
    return c.json(buildSuccessResponse(data), HttpStatusCode.CREATED);
  },
);

adminRoutes.patch(
  '/product-categories/:id',
  zValidator('json', productCategoryUpdateSchema),
  async (c) => {
    const id = Number(c.req.param('id'));
    if (!Number.isFinite(id) || id < 1) {
      return c.json(
        buildErrorResponse(ErrorCodes.VALIDATION_FAILED, HttpStatusCode.BAD_REQUEST, 'Invalid id'),
        HttpStatusCode.BAD_REQUEST,
      );
    }
    const body = c.req.valid('json');
    const db = createDb(c.env);
    const data = await catalog.updateProductCategoryAdmin(db, id, body);
    return c.json(buildSuccessResponse(data));
  },
);

adminRoutes.delete('/product-categories/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (!Number.isFinite(id) || id < 1) {
    return c.json(
      buildErrorResponse(ErrorCodes.VALIDATION_FAILED, HttpStatusCode.BAD_REQUEST, 'Invalid id'),
      HttpStatusCode.BAD_REQUEST,
    );
  }
  const db = createDb(c.env);
  await catalog.deleteProductCategoryAdmin(db, id);
  return c.json(buildSuccessResponse(null));
});

adminRoutes.get('/orders', async (c) => {
  const db = createDb(c.env);
  const data = await catalog.listOrdersAdmin(db);
  return jsonWithRevalidation(c, buildSuccessResponse(data));
});

adminRoutes.patch('/orders/:id', zValidator('json', orderStatusUpdateSchema), async (c) => {
  const id = Number(c.req.param('id'));
  if (!Number.isFinite(id) || id < 1) {
    return c.json(
      buildErrorResponse(ErrorCodes.VALIDATION_FAILED, HttpStatusCode.BAD_REQUEST, 'Invalid order id'),
      HttpStatusCode.BAD_REQUEST,
    );
  }
  const { order_status } = c.req.valid('json');
  const db = createDb(c.env);
  const data = await catalog.updateOrderStatusAdmin(db, id, order_status);
  return c.json(buildSuccessResponse(data));
});

adminRoutes.get('/customers', async (c) => {
  const db = createDb(c.env);
  const data = await catalog.listCustomersAdmin(db);
  return jsonWithRevalidation(c, buildSuccessResponse(data));
});

adminRoutes.get('/analytics', async (c) => {
  const db = createDb(c.env);
  const data = await catalog.getAnalyticsAdmin(db);
  return jsonWithRevalidation(c, buildSuccessResponse(data));
});

adminRoutes.get('/blogs', async (c) => {
  const db = createDb(c.env);
  const data = await catalog.listBlogsAdmin(db);
  return jsonWithRevalidation(c, buildSuccessResponse(data));
});

adminRoutes.post('/blogs', zValidator('json', blogCreateSchema), async (c) => {
  const body = c.req.valid('json');
  const db = createDb(c.env);
  const data = await catalog.createBlogAdmin(db, body);
  return c.json(buildSuccessResponse(data), HttpStatusCode.CREATED);
});

adminRoutes.patch('/blogs/:id', zValidator('json', blogUpdateSchema), async (c) => {
  const id = Number(c.req.param('id'));
  if (!Number.isFinite(id) || id < 1) {
    return c.json(
      buildErrorResponse(ErrorCodes.VALIDATION_FAILED, HttpStatusCode.BAD_REQUEST, 'Invalid blog id'),
      HttpStatusCode.BAD_REQUEST,
    );
  }
  const body = c.req.valid('json');
  const db = createDb(c.env);
  const data = await catalog.updateBlogAdmin(db, id, body);
  return c.json(buildSuccessResponse(data));
});

adminRoutes.delete('/blogs/:id', async (c) => {
  const id = Number(c.req.param('id'));
  if (!Number.isFinite(id) || id < 1) {
    return c.json(
      buildErrorResponse(ErrorCodes.VALIDATION_FAILED, HttpStatusCode.BAD_REQUEST, 'Invalid blog id'),
      HttpStatusCode.BAD_REQUEST,
    );
  }
  const db = createDb(c.env);
  await catalog.deleteBlogAdmin(db, id);
  return c.json(buildSuccessResponse(null));
});
