package com.block.file;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONObject;
import org.json.JSONTokener;

/**
 * Servlet implementation class File
 */
@WebServlet("/File")
public class FileServlet extends HttpServlet {

    private static final long    serialVersionUID = 1L;

    private static final boolean debug            = true;

    private static final String  ROOT_PATH        = "res";

    public FileServlet() {
    }

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String relpath = request.getPathInfo();
        if (relpath != null) {
            relpath.replaceAll("\\.\\.", "");
        }

        synchronized (this) {
            File f = getFile(ROOT_PATH + request.getPathInfo());
            if (f == null || !f.isFile()) {
                append("{}", response.getWriter());
            } else {
                append(f, response.getWriter());
            }
            if (debug) {
                byte[] fcontent = getFileContent(f);
                JSONObject jsonObject = new JSONObject(new JSONTokener(new InputStreamReader(new ByteArrayInputStream(
                        fcontent))));
                System.out.println(jsonObject.toString(4));
            }
        }
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException,
            IOException {
        try {
            byte[] buf = getRequestContent(request);
            JSONObject jsonObject = new JSONObject(
                    new JSONTokener(new InputStreamReader(new ByteArrayInputStream(buf))));
            synchronized (this) {
                updateFile(ROOT_PATH + request.getPathInfo(), jsonObject);
            }
            if (debug) {
                System.out.println(jsonObject.toString(4));
            }
            append("{\"status\":\"success\"}", response.getWriter());
        } catch (IOException e) {
            append("{\"status\":\"fail\"}", response.getWriter());
        }
    }
   
    private void updateFile(String file, JSONObject jsonObject) throws IOException {
        File f = createFile(file);
        BufferedWriter bout = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(f)));
        String content = jsonObject.toString();
        bout.write(content);
        bout.close();
    }

    private byte[] getRequestContent(HttpServletRequest request) throws IOException {
        return getContent(request.getInputStream());
    }

    private byte[] getFileContent(File f) throws IOException {
        FileInputStream fin = new FileInputStream(f);
        byte[] res = getContent(fin);
        fin.close();
        return res;
    }

    private byte[] getContent(InputStream in) throws IOException {
        ByteArrayOutputStream bout = new ByteArrayOutputStream(1024);
        byte[] buf = new byte[512];
        int count = 0;
        while ((count = in.read(buf)) != -1) {
            bout.write(buf, 0, count);
        }
        return bout.toByteArray();
    }

    private File getFile(String path) {
        File f = new File(getServletContext().getRealPath(path));
        return f.exists() ? f : null;
    }

    private File createFile(String path) throws IOException {
        File f = new File(getServletContext().getRealPath(path));
        if (!f.exists()) {
            File parent = f.getParentFile();
            if (parent != null) {
                parent.mkdirs();
            }
            f.createNewFile();
        }
        return f;
    }

    private void append(String str, PrintWriter writer) throws IOException {
        writer.write(str);
    }

    private void append(File f, PrintWriter writer) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(new FileInputStream(f), "utf-8"));
        char[] buffer = new char[1 << 12];
        int c = 0;
        while ((c = reader.read(buffer)) != -1) {
            writer.write(buffer, 0, c);
        }
        System.out.println();
    }
}
